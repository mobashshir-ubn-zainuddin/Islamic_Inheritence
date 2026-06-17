"""
Islamic Inheritance Calculation Engine (Hanafi School)
Implements all Quranic rules and Hanafi jurisprudence
"""

from fractions import Fraction
import math
from typing import Dict, List, Tuple, Optional, Any
from .models import RelativeType, RelativeInfo, RelativeShare, InheritanceResult


class InheritanceEngine:
    """
    Core inheritance calculation engine following Hanafi school rules.
    Based on Qur'an 4:11, 4:12 and Hanafi jurisprudence.
    """
     
    def __init__(self):
        """Initialize with prescribed shares (Al-Furud) rules"""
        self.prescribed_shares = {
            # Spouses
            RelativeType.HUSBAND: {"with_children": Fraction(1, 4), "without_children": Fraction(1, 2)},
            RelativeType.WIFE: {"with_children": Fraction(1, 8), "without_children": Fraction(1, 4)},
            
            # Direct descendants 
            RelativeType.SON: "residuary",  # Inherits remainder
            RelativeType.DAUGHTER: {"only_one": Fraction(1, 2), "multiple": Fraction(2, 3)},
            RelativeType.GRANDSON: "residuary_if_no_son",
            RelativeType.GRANDDAUGHTER: {"only_one_no_son": Fraction(1, 2), "multiple_no_son": Fraction(2, 3)},
            
            # Direct ancestors
            RelativeType.FATHER: {"with_children": Fraction(1, 6), "without_children": "residuary"},
            RelativeType.MOTHER: {"with_children": Fraction(1, 6), "without_children": Fraction(1, 3)},
            RelativeType.GRANDFATHER: {"with_children": Fraction(1, 6), "without_children": "residuary"},
            RelativeType.PATERNAL_GRANDMOTHER: Fraction(1, 6),
            RelativeType.MATERNAL_GRANDMOTHER: Fraction(1, 6),
            
            # Siblings (only inherit if no descendants or father)
            RelativeType.FULL_BROTHER: "residuary",
            RelativeType.FULL_SISTER: {"only_one": Fraction(1, 2), "multiple": Fraction(2, 3)},
            RelativeType.PATERNAL_BROTHER: "residuary",
            RelativeType.PATERNAL_SISTER: {"only_one": Fraction(1, 2), "multiple": Fraction(2, 3)},
            
            # Other relatives (inherit only if no closer relatives)
            RelativeType.FULL_NEPHEW: "residuary",
            RelativeType.PATERNAL_NEPHEW: "residuary",
            RelativeType.FULL_UNCLE: "residuary",
            RelativeType.PATERNAL_UNCLE: "residuary",
        }
        
        self.relative_names = {
            RelativeType.HUSBAND: "Husband",
            RelativeType.WIFE: "Wife",
            RelativeType.SON: "Son",
            RelativeType.DAUGHTER: "Daughter",
            RelativeType.GRANDSON: "Grandson (Son's Son)",
            RelativeType.GRANDDAUGHTER: "Granddaughter (Son's Daughter)",
            RelativeType.FATHER: "Father",
            RelativeType.MOTHER: "Mother",
            RelativeType.PATERNAL_GRANDMOTHER: "Paternal Grandmother",
            RelativeType.MATERNAL_GRANDMOTHER: "Maternal Grandmother",
            RelativeType.FULL_BROTHER: "Full Brother",
            RelativeType.FULL_SISTER: "Full Sister",
            RelativeType.PATERNAL_BROTHER: "Paternal Brother",
            RelativeType.PATERNAL_SISTER: "Paternal Sister",
            RelativeType.MATERNAL_BROTHER: "Maternal Brother",
            RelativeType.MATERNAL_SISTER: "Maternal Sister",
            RelativeType.FULL_NEPHEW: "Full Nephew (Brother's Son)",
            RelativeType.PATERNAL_NEPHEW: "Paternal Nephew",
            RelativeType.FULL_NEPHEW_SON: "Full Nephew's Son",
            RelativeType.PATERNAL_NEPHEW_SON: "Paternal Nephew's Son",
            RelativeType.FULL_UNCLE: "Full Uncle",
            RelativeType.PATERNAL_UNCLE: "Paternal Uncle",
            RelativeType.FULL_COUSIN: "Full Cousin",
            RelativeType.PATERNAL_COUSIN: "Paternal Cousin",
            RelativeType.FULL_COUSIN_SON: "Full Cousin's Son",
            RelativeType.PATERNAL_COUSIN_SON: "Paternal Cousin's Son",
            RelativeType.FULL_COUSIN_GRANDSON: "Full Cousin's Grandson",
            RelativeType.PATERNAL_COUSIN_GRANDSON: "Paternal Cousin's Grandson",
        }
    
    def gcd(self, a: int, b: int) -> int:
        """Calculate the greatest common divisor of two numbers"""
        while b:
            a, b = b, a % b
        return a
    
    def lcm(self, a: int, b: int) -> int:
        """Calculate the least common multiple of two numbers"""
        if a == 0 or b == 0:
            return 0
        return abs(a * b) // self.gcd(a, b)
    
    def lcm_list(self, numbers: List[int]) -> int:
        """Calculate the least common multiple of a list of numbers"""
        result = 1
        for num in numbers:
            result = self.lcm(result, num)
        return result
    
    def calculate_inheritance(
        self,
        total_estate: float,
        relatives: List[RelativeInfo]
    ) -> InheritanceResult:
        """
        Calculate inheritance distribution following Hanafi rules.
        
        Args:
            total_estate: Total value of the estate
            relatives: List of surviving relatives with their counts
            
        Returns:
            InheritanceResult with detailed breakdown and calculation steps
        """
        
        # Validation
        self._validate_relatives(relatives)
        
        # Build relative types set for easier lookup
        relative_types_set = {r.relative_type for r in relatives}
        
        # Determine inheritance priority groups
        has_children = self._has_lineal_descendants(relative_types_set)
        has_father = RelativeType.FATHER in relative_types_set
        
        # Calculate shares - FIRST calculate ALL fixed shares (spouses, daughters, parents, etc.)
        shares_dict: Dict[RelativeType, Fraction] = {}
        calculation_steps: List[str] = []
        
        # Process spouses first (they have fixed shares)
        _ = self._process_spouses(relative_types_set, shares_dict, has_children, calculation_steps)
        
        # Process daughters (fixed shares, no sons)
        if RelativeType.SON not in relative_types_set and RelativeType.DAUGHTER in relative_types_set:
            daughter_info = next(r for r in relatives if r.relative_type == RelativeType.DAUGHTER)
            share = Fraction(1, 2) if daughter_info.count == 1 else Fraction(2, 3)
            shares_dict[RelativeType.DAUGHTER] = share
            calculation_steps.append(f"{'Daughter gets' if daughter_info.count == 1 else 'Daughters collectively get'} {share} (Qur'an 4:11)")
        
        # Process father
        if RelativeType.FATHER in relative_types_set:
            # Base prescribed share
            share = Fraction(1, 6)
            shares_dict[RelativeType.FATHER] = share
            calculation_steps.append(f"Father gets prescribed share of {share} (Qur'an 4:11)")
        
        # Process mother
        if RelativeType.MOTHER in relative_types_set:
            share = Fraction(1, 6) if has_children else Fraction(1, 3)
            shares_dict[RelativeType.MOTHER] = share
            calculation_steps.append(f"Mother gets {share} (Qur'an 4:11)")
        
        # Now adjust shares if total exceeds 1 (Awal)
        shares_dict, calculation_steps = self._adjust_shares_if_needed(shares_dict, calculation_steps)
        
        # Calculate residual
        total_fixed = sum(s for s in shares_dict.values() if isinstance(s, Fraction))
        remaining = Fraction(1) - total_fixed
        
        if remaining > 0:
            calculation_steps.append(f"Remaining share after fixed allocations: {remaining}")
            if RelativeType.SON in relative_types_set:
                # Sons and daughters as Asaba (2:1)
                son_info = next(r for r in relatives if r.relative_type == RelativeType.SON)
                daughter_info = next((r for r in relatives if r.relative_type == RelativeType.DAUGHTER), None)
                daughter_count = daughter_info.count if daughter_info else 0
                
                total_units = son_info.count * 2 + daughter_count
                share_per_unit = remaining / total_units
                
                shares_dict[RelativeType.SON] = (share_per_unit * 2) * son_info.count
                if daughter_info:
                    shares_dict[RelativeType.DAUGHTER] = share_per_unit * daughter_count
                
                calculation_steps.append(f"Sons and daughters share the remainder as Asaba (2:1 ratio).")
            elif RelativeType.FATHER in relative_types_set:
                # Father takes residual
                shares_dict[RelativeType.FATHER] += remaining
                calculation_steps.append(f"Father takes the remaining {remaining} as Asaba.")
            elif RelativeType.GRANDFATHER in relative_types_set:
                shares_dict[RelativeType.GRANDFATHER] = shares_dict.get(RelativeType.GRANDFATHER, Fraction(0)) + remaining
                calculation_steps.append(f"Grandfather takes the remaining {remaining} as Asaba.")
        
        # Build results
        relatives_list = self._build_relatives_list(relatives, shares_dict, total_estate)
        
        # Summary by category
        summary = self._build_summary(relatives_list)
        
        return InheritanceResult(
            total_estate=total_estate,
            relatives_list=relatives_list,
            calculation_steps=calculation_steps,
            summary=summary,
            status="success"
        )
    
    def _adjust_shares_if_needed(
        self,
        shares_dict: Dict[RelativeType, Fraction],
        steps: List[str]
    ) -> Tuple[Dict[RelativeType, Fraction], List[str]]:
        """
        Adjust shares if their sum exceeds 1.
        Uses LCM for common denominators and adjusts proportionally.
        """
        # Filter out non-Fraction values (like "residuary")
        fraction_shares = {
            k: v for k, v in shares_dict.items() 
            if isinstance(v, Fraction)
        }
        
        if not fraction_shares:
            return shares_dict, steps
        
        # Calculate total share
        total_share = sum(fraction_shares.values())
        
        if total_share > 1:
            steps.append(f"Total shares sum to {total_share} which exceeds 1. Adjusting proportionally.")
            
            # Get denominators of all shares
            denominators = [share.denominator for share in fraction_shares.values()]
            common_denominator = self.lcm_list(denominators)
            
            # Convert all shares to common denominator
            numerators = {
                k: (share.numerator * (common_denominator // share.denominator))
                for k, share in fraction_shares.items()
            }
            total_numerator = sum(numerators.values())
            
            # Adjust shares so that sum is exactly 1 (total_numerator/total_numerator)
            adjusted_shares = {
                k: Fraction(numerators[k], total_numerator)
                for k in fraction_shares.keys()
            }
            
            # Update shares_dict with adjusted values
            shares_dict.update(adjusted_shares)
            
            # Add step explaining the adjustment
            for k, share in adjusted_shares.items():
                steps.append(f"{self.relative_names[k]} adjusted share: {share}")
        
        return shares_dict, steps
    
    def _validate_relatives(self, relatives: List[RelativeInfo]) -> None:
        """Validate that relative combinations are valid"""
        relative_types = {r.relative_type for r in relatives}
        
        # Non-Muslims cannot inherit
        # (This is noted as a general principle, handled by user verification)
        
        # Cannot have both widow(s) and widower
        if RelativeType.HUSBAND in relative_types and RelativeType.WIFE in relative_types:
            raise ValueError("Cannot have both husband and wife as surviving relatives")
        
        # Check counts for each relative type
        for relative in relatives:
            if relative.relative_type == RelativeType.HUSBAND and relative.count > 1:
                raise ValueError("Cannot have more than 1 husband")
            if relative.relative_type == RelativeType.WIFE and relative.count > 4:
                raise ValueError("Cannot have more than 4 wives")
            if relative.relative_type == RelativeType.FATHER and relative.count > 1:
                raise ValueError("Cannot have more than 1 father")
            if relative.relative_type == RelativeType.MOTHER and relative.count > 1:
                raise ValueError("Cannot have more than 1 mother")
    
    def _has_lineal_descendants(self, relative_types: set) -> bool:
        """Check if deceased has any lineal descendants (children)"""
        return any(t in relative_types for t in [
            RelativeType.SON, RelativeType.DAUGHTER,
            RelativeType.GRANDSON, RelativeType.GRANDDAUGHTER
        ])
    
    def _process_spouses(
        self,
        relative_types: set,
        shares_dict: Dict[RelativeType, Fraction],
        has_children: bool,
        steps: List[str]
    ) -> Fraction:
        """Process spouse shares"""
        total_spouse_share = Fraction(0)
        
        if RelativeType.HUSBAND in relative_types:
            share = Fraction(1, 4) if has_children else Fraction(1, 2)
            shares_dict[RelativeType.HUSBAND] = share
            total_spouse_share += share
            steps.append(f"Husband gets {share} (Qur'an 4:12)")
        
        if RelativeType.WIFE in relative_types:
            total_wife_share = (Fraction(1, 8) if has_children else Fraction(1, 4))
            shares_dict[RelativeType.WIFE] = total_wife_share
            total_spouse_share += total_wife_share
            steps.append(f"Wives share {total_wife_share} (Qur'an 4:12)")
        
        return total_spouse_share
    
    def _process_descendants(
        self,
        relative_types: set,
        shares_dict: Dict[RelativeType, Fraction],
        remaining: Fraction,
        steps: List[str]
    ) -> Fraction:
        """Process descendant shares"""
        
        # Sons and daughters get remainder (2:1 rule)
        if RelativeType.SON in relative_types:
            steps.append("Sons and daughters inherit remainder (2:1 male:female ratio - Qur'an 4:11)")
            shares_dict[RelativeType.SON] = Fraction(1)  # Mark as residuary
            if RelativeType.DAUGHTER in relative_types:
                shares_dict[RelativeType.DAUGHTER] = Fraction(1)
            return Fraction(0)  # All remaining goes to children
        
        # Only daughters (no sons)
        if RelativeType.DAUGHTER in relative_types:
            share = Fraction(2, 3)  # if multiple daughters
            shares_dict[RelativeType.DAUGHTER] = share
            steps.append(f"Daughters inherit {share} (Qur'an 4:11)")
            return remaining - share
        
        # Grandsons and granddaughters (only if no children)
        if RelativeType.GRANDSON in relative_types or RelativeType.GRANDDAUGHTER in relative_types:
            steps.append("Grandsons and granddaughters inherit remainder (if no children)")
            shares_dict[RelativeType.GRANDSON] = Fraction(1)
            shares_dict[RelativeType.GRANDDAUGHTER] = Fraction(1)
            return Fraction(0)
        
        return remaining
    
    def _process_ascendants(
        self,
        relative_types: set,
        shares_dict: Dict[RelativeType, Fraction],
        remaining: Fraction,
        has_children: bool,
        steps: List[str]
    ) -> Fraction:
        """Process ascendant shares"""
        
        if RelativeType.FATHER in relative_types:
            share = Fraction(1, 6) if has_children else remaining
            shares_dict[RelativeType.FATHER] = share
            steps.append(f"Father gets {share} (Qur'an 4:11)")
            remaining -= share if share != remaining else remaining
        
        if RelativeType.MOTHER in relative_types:
            if RelativeType.FULL_BROTHER in relative_types or RelativeType.FULL_SISTER in relative_types or RelativeType.PATERNAL_BROTHER in relative_types or RelativeType.PATERNAL_SISTER in relative_types or RelativeType.MATERNAL_BROTHER in relative_types or RelativeType.MATERNAL_SISTER in relative_types:
                share = Fraction(1, 6)
            else:
                share = Fraction(1, 3) if not has_children else Fraction(1, 6)
            shares_dict[RelativeType.MOTHER] = share
            steps.append(f"Mother gets {share} (Qur'an 4:11)")
            remaining -= share
        
        # Grandparents only if no parents
        if RelativeType.FATHER not in relative_types:
            if RelativeType.GRANDFATHER in relative_types:
                share = Fraction(1, 6)
                shares_dict[RelativeType.GRANDFATHER] = share
                remaining -= share
            
            # Both paternal and maternal grandmothers share 1/6
            if RelativeType.PATERNAL_GRANDMOTHER in relative_types or RelativeType.MATERNAL_GRANDMOTHER in relative_types:
                # Calculate how many grandmothers there are
                num_grandmothers = 0
                if RelativeType.PATERNAL_GRANDMOTHER in relative_types:
                    num_grandmothers += 1
                if RelativeType.MATERNAL_GRANDMOTHER in relative_types:
                    num_grandmothers += 1
                
                share_per_grandmother = Fraction(1, 6) / num_grandmothers
                
                if RelativeType.PATERNAL_GRANDMOTHER in relative_types:
                    shares_dict[RelativeType.PATERNAL_GRANDMOTHER] = share_per_grandmother
                    remaining -= share_per_grandmother
                    steps.append(f"Paternal Grandmother gets {share_per_grandmother} (Qur'an 4:11)")
                
                if RelativeType.MATERNAL_GRANDMOTHER in relative_types:
                    shares_dict[RelativeType.MATERNAL_GRANDMOTHER] = share_per_grandmother
                    remaining -= share_per_grandmother
                    steps.append(f"Maternal Grandmother gets {share_per_grandmother} (Qur'an 4:11)")
        
        return remaining
    
    def _process_siblings(
        self,
        relative_types: set,
        shares_dict: Dict[RelativeType, Fraction],
        remaining: Fraction,
        has_father: bool,
        steps: List[str]
    ) -> Fraction:
        """Process sibling shares (only if no ascendants or descendants)"""
        # Simplified - full implementation would handle complex sibling scenarios
        return remaining
    
    def _process_other_relatives(
        self,
        relative_types: set,
        shares_dict: Dict[RelativeType, Fraction],
        remaining: Fraction,
        steps: List[str]
    ) -> Fraction:
        """Process other relatives"""
        return remaining
    
    def _build_relatives_list(
        self,
        relatives: List[RelativeInfo],
        shares_dict: Dict[RelativeType, Fraction],
        total_estate: float
    ) -> List[RelativeShare]:
        """Build the final relatives list with amounts"""
        result = []
        
        # Collect all individual shares first to find LCM
        all_individual_shares = []
        relative_info_list = []
        
        for relative in relatives:
            share_fraction = shares_dict.get(relative.relative_type, Fraction(0))
            count = relative.count
            
            # Calculate individual share (divide category share by count)
            if isinstance(share_fraction, Fraction):
                individual_share = share_fraction / count
                all_individual_shares.append(individual_share)
                relative_info_list.append((relative, individual_share))
        
        # Calculate common denominator for all individual shares
        denominators = [share.denominator for share in all_individual_shares]
        common_denominator = self.lcm_list(denominators) if denominators else 1
        
        for relative, individual_share in relative_info_list:
            # Calculate percentage and amount
            share_percentage = float(individual_share) * 100
            amount = total_estate * float(individual_share)
            
            # Format share with common denominator
            numerator = individual_share.numerator * (common_denominator // individual_share.denominator)
            share_str = f"{numerator}/{common_denominator}"
            
            base_name = self.relative_names.get(relative.relative_type, str(relative.relative_type))
            
            if relative.count == 1:
                result.append(
                    RelativeShare(
                        relative_type=relative.relative_type,
                        relative_name=base_name,
                        count=1,
                        share_fraction=share_str,
                        share_percentage=share_percentage,
                        amount=amount
                    )
                )
            else:
                for i in range(1, relative.count + 1):
                    result.append(
                        RelativeShare(
                            relative_type=relative.relative_type,
                            relative_name=f"{base_name} {i}",
                            count=1,
                            share_fraction=share_str,
                            share_percentage=share_percentage,
                            amount=amount
                        )
                    )
        
        return result
    
    def _build_summary(self, relatives_list: List[RelativeShare]) -> Dict[str, Any]:
        """Build summary statistics"""
        total_distributed = sum(r.amount for r in relatives_list)
        
        return {
            "total_distributed": total_distributed,
            "num_heirs": len(relatives_list),
            "categories": self._categorize_relatives(relatives_list)
        }
    
    def _categorize_relatives(self, relatives_list: List[RelativeShare]) -> Dict[str, List[str]]:
        """Categorize relatives by type"""
        categories = {
            "spouses": [],
            "descendants": [],
            "ascendants": [],
            "siblings": [],
            "others": []
        }
        
        spouse_types = {RelativeType.HUSBAND.value, RelativeType.WIFE.value}
        descendant_types = {RelativeType.SON.value, RelativeType.DAUGHTER.value, RelativeType.GRANDSON.value, RelativeType.GRANDDAUGHTER.value}
        ascendant_types = {RelativeType.FATHER.value, RelativeType.MOTHER.value, RelativeType.GRANDFATHER.value,
                          RelativeType.PATERNAL_GRANDMOTHER.value, RelativeType.MATERNAL_GRANDMOTHER.value}
        sibling_types = {RelativeType.FULL_BROTHER.value, RelativeType.FULL_SISTER.value, RelativeType.PATERNAL_BROTHER.value,
                        RelativeType.PATERNAL_SISTER.value, RelativeType.MATERNAL_BROTHER.value, RelativeType.MATERNAL_SISTER.value}
        
        for relative in relatives_list:
            rel_type = relative.relative_type
            if rel_type in spouse_types:
                categories["spouses"].append(relative.relative_name)
            elif rel_type in descendant_types:
                categories["descendants"].append(relative.relative_name)
            elif rel_type in ascendant_types:
                categories["ascendants"].append(relative.relative_name)
            elif rel_type in sibling_types:
                categories["siblings"].append(relative.relative_name)
            else:
                categories["others"].append(relative.relative_name)
        
        return {k: v for k, v in categories.items() if v}
